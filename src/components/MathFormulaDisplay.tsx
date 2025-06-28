import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Lightbulb, Target } from 'lucide-react';

interface MathFormulaDisplayProps {
  topic: string;
  formulas: string[];
  examples: string[];
}

const MathFormulaDisplay: React.FC<MathFormulaDisplayProps> = ({ topic, formulas, examples }) => {
  return (
    <Card className="mb-6 border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader className="border-b-2 border-green-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-full">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-gray-800">
              Math Magic: {topic} ✨
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
              Important Formulas
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Formulas Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Key Formulas to Remember:</h3>
            </div>
            <div className="space-y-2">
              {formulas.map((formula, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                  <code className="text-lg font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {formula}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Examples Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <h3 className="font-semibold text-gray-800">Quick Examples:</h3>
            </div>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-yellow-200 shadow-sm">
                  <p className="text-gray-700">{example}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              💡 Tip: Practice these formulas with real examples to remember them better!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MathFormulaDisplay; 